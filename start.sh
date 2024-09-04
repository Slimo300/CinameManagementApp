minikube delete
minikube start
minikube addons enable ingress

# Creating ConfigMap for every file in init-scripts directory. 
# It will store init scripts for our mongo instances
for FILE in init-scripts/*
do 
    filename=$(basename "$FILE")
    kubectl create cm "${filename%.*}" --from-file=$FILE
done

skaffold dev
