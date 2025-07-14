#!/bin/sh

# Répertoire contenant les fichiers JS buildés
BUILD_DIR="/usr/share/nginx/html/assets"
ENV_FILE="/usr/share/nginx/html/.env"

echo "🚀 Démarrage du script d'injection des variables d'environnement..."

# Fonction pour obtenir la valeur d'une variable depuis le fichier .env
get_env_value() {
    local VAR_NAME="$1"
    if [ -f "$ENV_FILE" ]; then
        grep "^${VAR_NAME}=" "$ENV_FILE" | cut -d '=' -f 2- | tr -d '"'
    fi
}

# Liste des variables à remplacer (basée sur votre .env)
ENV_VARS="VITE_API_URL VITE_BASE_URL VITE_API_2FA_URL"

for VAR_NAME in $ENV_VARS; do
    # Obtenir la valeur par défaut depuis .env
    DEFAULT_VALUE=$(get_env_value "$VAR_NAME")
    
    # Utiliser la variable d'environnement Docker si elle existe, sinon utiliser la valeur par défaut
    VAR_VALUE="${!VAR_NAME:-$DEFAULT_VALUE}"
    
    echo "📝 Remplacement de __${VAR_NAME}__ par: $VAR_VALUE"
    
    # Remplacer dans tous les fichiers JS
    if [ -d "$BUILD_DIR" ]; then
        for file in "$BUILD_DIR"/*.js; do
            if [ -f "$file" ]; then
                sed -i "s|__${VAR_NAME}__|${VAR_VALUE}|g" "$file"
            fi
        done
    fi
    
    # Remplacer aussi dans le fichier HTML principal si nécessaire
    if [ -f "/usr/share/nginx/html/index.html" ]; then
        sed -i "s|__${VAR_NAME}__|${VAR_VALUE}|g" "/usr/share/nginx/html/index.html"
    fi
done

echo "✅ Injection des variables d'environnement terminée"

# Démarrer nginx
exec "$@"