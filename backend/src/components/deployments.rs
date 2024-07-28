use chrono::{DateTime, Utc};
use k8s_openapi::api::apps::v1::Deployment;
use kube::{
    api::{Api, ListParams},
    Client,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct DeploymentInfo {
    name: String,
    namespace: String,
    ready: String,
    age: i64,
}

#[tauri::command]
pub async fn get_deployments(namespace: Option<String>) -> Result<Vec<DeploymentInfo>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let deployments: Api<Deployment> = match namespace {
        Some(ns) => Api::namespaced(client, &ns),
        None => Api::all(client),
    };

    let lp = ListParams::default();
    let deployment_list = deployments.list(&lp).await.map_err(|e| e.to_string())?;

    let now = Utc::now();
    let deployment_info: Vec<DeploymentInfo> = deployment_list
        .iter()
        .map(|deployment| {
            let creation_timestamp = deployment
                .metadata
                .creation_timestamp
                .as_ref()
                .map(|ts| DateTime::<Utc>::from(ts.0))
                .unwrap_or(now);
            let age = (now - creation_timestamp).num_seconds();

            let ready = deployment
                .status
                .as_ref()
                .and_then(|s| s.ready_replicas)
                .unwrap_or(0);
            let replicas = deployment
                .spec
                .as_ref()
                .and_then(|s| s.replicas)
                .unwrap_or(0);

            DeploymentInfo {
                name: deployment.metadata.name.clone().unwrap_or_default(),
                namespace: deployment.metadata.namespace.clone().unwrap_or_default(),
                ready: format!("{}/{}", ready, replicas),
                age,
            }
        })
        .collect();

    Ok(deployment_info)
}

#[tauri::command]
pub async fn get_deployment_yaml(name: String, namespace: String) -> Result<String, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let deployments: Api<Deployment> = Api::namespaced(client, &namespace);

    let deployment = deployments.get(&name).await.map_err(|e| e.to_string())?;
    serde_yaml::to_string(&deployment).map_err(|e| e.to_string())
}
