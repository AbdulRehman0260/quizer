// helper function to get environment variables and throw an error if they are not defined
export const getEnvVariable = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
};
export const getOptionalEnvVariable = (name) => {
    const value = process.env[name];
    return value === undefined ? undefined : value;
};
export const getDatabaseUrl = () => {
    const hasSplitDatabaseConfig = Boolean(process.env.DB_HOST || process.env.DB_PORT || process.env.DB_NAME || process.env.DB_USER || process.env.DB_PASSWORD);
    if (hasSplitDatabaseConfig) {
        const username = getEnvVariable('DB_USER');
        const password = getOptionalEnvVariable('DB_PASSWORD');
        const host = getEnvVariable('DB_HOST');
        const port = getOptionalEnvVariable('DB_PORT') ?? '5432';
        const databaseName = getEnvVariable('DB_NAME');
        const sslMode = getOptionalEnvVariable('DB_SSLMODE');
        const url = new URL(`postgres://${host}:${port}/${databaseName}`);
        url.username = username;
        if (password) {
            url.password = password;
        }
        if (sslMode) {
            url.searchParams.set('sslmode', sslMode);
        }
        return url.toString();
    }
    const explicitDatabaseUrl = getOptionalEnvVariable('DB_URL');
    if (explicitDatabaseUrl) {
        return explicitDatabaseUrl;
    }
    throw new Error('Database configuration is missing. Set DB_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD.');
};
