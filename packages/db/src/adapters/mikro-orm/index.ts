/// <reference types="@rspack/core/module" />

import type { EntityClass } from "@mikro-orm/core";
export * from "./MikroOrmDatabase.ts";

export const loadModels = () => {
  const modelsContext = import.meta.webpackContext('./models', { recursive: false })
  return modelsContext.keys().reduce((acc, key) => {
    const modelName = key.replace('./', '').replace('.ts', '');
    const modelModule = modelsContext(key) as Record<string, EntityClass<unknown>>;
    const modelClass = Object.values(modelModule)[0];
    if (!modelClass) {
      throw new Error(`Model class not found in module: ${key}`);
    }
    acc[modelName] = modelClass;
    return acc;
  }, {} as Record<string, EntityClass<unknown>>);
}
