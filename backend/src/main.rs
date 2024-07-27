// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use k8s_openapi::api::core::v1::Pod;
use kube::config::Kubeconfig;
use kube::{
    api::{Api, ListParams},
    Client,
};
use serde::Serialize;
use tauri::Manager;

#[derive(Serialize)]
struct PodInfo {
    name: String,
    namespace: String,
    status: String,
}

#[tauri::command]
async fn get_clusters() -> Result<Vec<String>, String> {
    println!("get_clusters function called");
    let kubeconfig = Kubeconfig::read().map_err(|e| e.to_string())?;
    let clusters: Vec<String> = kubeconfig.contexts.into_iter().map(|c| c.name).collect();

    // Log the clusters being sent to the frontend
    println!("Sending clusters to frontend: {:?}", clusters);

    Ok(clusters)
}

#[tauri::command]
async fn get_pods(namespace: Option<String>) -> Result<Vec<PodInfo>, String> {
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

#[tauri::command]
async fn get_namespaces() -> Result<Vec<String>, String> {
    let client = Client::try_default().await.map_err(|e| e.to_string())?;
    let namespaces: Api<k8s_openapi::api::core::v1::Namespace> = Api::all(client);

    let lp = ListParams::default();
    let namespace_list = namespaces.list(&lp).await.map_err(|e| e.to_string())?;

    let namespace_names: Vec<String> = namespace_list
        .iter()
        .filter_map(|ns| ns.metadata.name.clone())
        .collect();

    Ok(namespace_names)
}

fn main() {
    println!("Starting Tauri application");
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_clusters,
            get_pods,
            get_namespaces
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
