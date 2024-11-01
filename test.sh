for file in apps/frontend/src/routes/*.svelte; do
    # Ignore les fichiers de test existants
    if [[ ! $file =~ \.test\.ts$ ]]; then
        filename=$(basename "$file" .ts)
        touch "apps/frontend/src/tests/lib/components/authorization/${filename}.test.ts"
    fi
done