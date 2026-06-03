import * as tsm from "ts-morph";

export function getTypeScriptProject(
  projectOption: tsm.ProjectOptions,
): tsm.Project {
  const project = new tsm.Project(projectOption);
  return project;
}
