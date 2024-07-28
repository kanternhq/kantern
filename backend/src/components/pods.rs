use chrono::{DateTime, Utc};
use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{Api, ListParams},
    Client,
};
use serde::Serialize;
use serde_yaml;

#[derive(Serialize)]
pub struct PodInfo {
    name: String,
    namespace: String,
    status: String,
    age: i64,
    restarts: i32,
    ip: String,
    node: String,
}

#[tauri::command]
pub async fn get_pod_yaml(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let pods: Api<Pod> = Api::namespaced(client, &namespace);
    let pod = pods.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&pod).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> Result<Vec<PodInfo>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let pods: Api<Pod> = match namespace {
        Some(ns) => Api::namespaced(client, &ns),
        None => Api::all(client),
    };

    let lp = ListParams::default();
    let pod_list = pods.list(&lp).await.map_err(|e| e.to_string())?;

    let now = Utc::now();
    let pod_info: Vec<PodInfo> = pod_list
        .iter()
        .map(|pod| {
            let creation_timestamp = pod
                .metadata
                .creation_timestamp
                .as_ref()
                .map(|ts| DateTime::<Utc>::from(ts.0))
                .unwrap_or(now);
            let age = (now - creation_timestamp).num_seconds();

            let status = pod.status.as_ref();
            let restarts = status
                .and_then(|s| s.container_statuses.as_ref())
                .and_then(|cs| cs.first())
                .map(|c| c.restart_count)
                .unwrap_or(0);

            let ip = status.and_then(|s| s.pod_ip.clone()).unwrap_or_default();

            let node = pod
                .spec
                .as_ref()
                .and_then(|s| s.node_name.clone())
                .unwrap_or_default();

            PodInfo {
                name: pod.metadata.name.clone().unwrap_or_default(),
                namespace: pod.metadata.namespace.clone().unwrap_or_default(),
                status: pod
                    .status
                    .as_ref()
                    .and_then(|s| s.phase.clone())
                    .unwrap_or_default(),
                age,
                ip,
                node,
                restarts,
            }
        })
        .collect();

    Ok(pod_info)
}

#[tauri::command]
pub async fn get_pod_definition(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let pods: Api<Pod> = Api::namespaced(client, &namespace);
    let pod = pods.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&pod).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_pod(name: String, namespace: String) -> Result<(), String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let pods: Api<Pod> = Api::namespaced(client, &namespace);
    pods.delete(&name, &Default::default())
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
