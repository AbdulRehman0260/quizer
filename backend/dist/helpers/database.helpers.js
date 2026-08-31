//helper function to get environment variables and throw an error if they are not defined
export const getEnvVariable = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
};
