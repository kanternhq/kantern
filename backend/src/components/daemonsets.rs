use chrono::Utc;
use k8s_openapi::api::apps::v1::DaemonSet;
use kube::{
    api::{Api, DeleteParams, ListParams},
    Client,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct DsInfo {
    name: String,
    age: i64,
}

#[tauri::command]
pub async fn get_daemon_sets(namespace: String) -> Result<Vec<DsInfo>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let daemon_sets: Api<DaemonSet> = Api::namespaced(client, &namespace);

    let lp = ListParams::default();
    let daemon_set_list = daemon_sets.list(&lp).await.map_err(|e| e.to_string())?;

    let now = Utc::now();
    let ds_info: Vec<DsInfo> = daemon_set_list
        .iter()
        .map(|ds| {
            let age = ds
                .metadata
                .creation_timestamp
                .as_ref()
                .map(|ts| now.signed_duration_since(ts.0).num_seconds())
                .unwrap_or(0);
            DsInfo {
                name: ds.metadata.name.clone().unwrap_or_default(),
                age,
            }
        })
        .collect();

    Ok(ds_info)
}

#[tauri::command]
pub async fn get_daemon_set_yaml(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let daemon_sets: Api<DaemonSet> = Api::namespaced(client, &namespace);

    let daemon_set = daemon_sets.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&daemon_set).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_daemon_set(name: String, namespace: String) -> Result<(), String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let daemon_sets: Api<DaemonSet> = Api::namespaced(client, &namespace);

    daemon_sets
        .delete(&name, &DeleteParams::default())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
