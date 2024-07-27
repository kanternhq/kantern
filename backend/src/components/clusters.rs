use kube::config::Kubeconfig;

#[tauri::command]
pub async fn get_clusters() -> Result<Vec<String>, String> {
    let kubeconfig = Kubeconfig::read().map_err(|e| e.to_string())?;
    Ok(kubeconfig.contexts.into_iter().map(|c| c.name).collect())
}
