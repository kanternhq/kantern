use chrono::Utc;
use k8s_openapi::api::core::v1::Service;
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
pub async fn get_services(namespace: String) -> Result<Vec<DsInfo>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let services: Api<Service> = Api::namespaced(client, &namespace);

    let lp = ListParams::default();
    let service_list = services.list(&lp).await.map_err(|e| e.to_string())?;

    let now = Utc::now();
    let ds_info: Vec<DsInfo> = service_list
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
pub async fn get_service_yaml(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let services: Api<Service> = Api::namespaced(client, &namespace);

    let service = services.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&service).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_service(name: String, namespace: String) -> Result<(), String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let services: Api<Service> = Api::namespaced(client, &namespace);

    services
        .delete(&name, &DeleteParams::default())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
