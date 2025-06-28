/// <reference types="@rspack/core/module" />

export * from "./MikroOrmDatabase.ts";

const modelsContext = import.meta.webpackContext('./models');
export const models = modelsContext.keys().reduce((acc, key) => {
  const modelName = key.replace('./', '').replace('.ts', '');
  const modelModule = modelsContext(key) as Record<string, unknown>;
  acc[modelName] = Object.values(modelModule)[0];
  return acc;
}, {} as Record<string, unknown>);
