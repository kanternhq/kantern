use chrono::Utc;
use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{
    api::{Api, DeleteParams, ListParams},
    Client,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct StsInfo {
    name: String,
    namespace: String,
    replicas: i32,
    ready_replicas: i32,
    update_strategy: String,
    age: i64,
}

#[tauri::command]
pub async fn get_stateful_sets(namespace: String) -> Result<Vec<StsInfo>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let stateful_sets: Api<StatefulSet> = Api::namespaced(client, &namespace);

    let lp = ListParams::default();
    let stateful_set_list = stateful_sets.list(&lp).await.map_err(|e| e.to_string())?;

    let now = Utc::now();
    let sts_info: Vec<StsInfo> = stateful_set_list
        .iter()
        .map(|sts| {
            let age = sts
                .metadata
                .creation_timestamp
                .as_ref()
                .map(|ts| now.signed_duration_since(ts.0).num_seconds())
                .unwrap_or(0);
            StsInfo {
                name: sts.metadata.name.clone().unwrap_or_default(),
                namespace: sts.metadata.namespace.clone().unwrap_or_default(),
                replicas: sts.spec.as_ref().and_then(|s| s.replicas).unwrap_or(0),
                ready_replicas: sts
                    .status
                    .as_ref()
                    .and_then(|s| s.ready_replicas)
                    .unwrap_or(0),
                update_strategy: sts
                    .spec
                    .as_ref()
                    .and_then(|s| s.update_strategy.as_ref())
                    .and_then(|us| us.type_.clone())
                    .unwrap_or_else(|| "RollingUpdate".to_string()), // Default to "RollingUpdate" if not specified
                age,
            }
        })
        .collect();

    Ok(sts_info)
}

#[tauri::command]
pub async fn get_stateful_set_yaml(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let stateful_sets: Api<StatefulSet> = Api::namespaced(client, &namespace);

    let stateful_set = stateful_sets.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&stateful_set).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_stateful_set(name: String, namespace: String) -> Result<(), String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let stateful_sets: Api<StatefulSet> = Api::namespaced(client, &namespace);

    stateful_sets
        .delete(&name, &DeleteParams::default())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
