minikube delete
minikube start
minikube addons enable ingress

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.15.3 \
  --set crds.enabled=true

kubectl apply -f ./infra/k8s/secrets/ca-secret.yaml
kubectl apply -f ./infra/k8s/cert-manager/cluster-issuer-ca.yaml
kubectl apply -f ./infra/k8s/cert-manager/certificate-ca.yaml

skaffold dev