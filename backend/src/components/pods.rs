use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{Api, ListParams},
    Client,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct PodInfo {
    name: String,
    namespace: String,
    status: String,
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

    let pod_info: Vec<PodInfo> = pod_list
        .iter()
        .map(|pod| PodInfo {
            name: pod.metadata.name.clone().unwrap_or_default(),
            namespace: pod.metadata.namespace.clone().unwrap_or_default(),
            status: pod
                .status
                .as_ref()
                .and_then(|s| s.phase.clone())
                .unwrap_or_default(),
        })
        .collect();

    Ok(pod_info)
}
