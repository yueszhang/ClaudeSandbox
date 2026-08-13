import type { CollectionEntry } from 'astro:content';

type Role = CollectionEntry<'roles'>;
type Project = CollectionEntry<'projects'>;

/**
 * Which projects belong to a role.
 *
 * Matching on job title does not work: a project's `role` is the hat worn on
 * that engagement ("AI Strategy & Enablement Lead"), not the employment title
 * on the role ("Senior Consultant — Product & AI"). Someone can also hold the
 * same title at the same company twice, which Joey did at Deloitte.
 *
 * So: same company, and the owning role is the latest one at that company that
 * started on or before the project.
 */
export function projectsForRole(role: Role, projects: Project[], roles: Role[]): Project[] {
  const atCompany = roles
    .filter((r) => r.data.company === role.data.company)
    .sort((a, b) => a.data.sortDate.localeCompare(b.data.sortDate));

  return projects.filter((project) => {
    if (project.data.company !== role.data.company) return false;
    const owner = [...atCompany]
      .reverse()
      .find((r) => r.data.sortDate <= project.data.sortDate);
    return owner?.id === role.id;
  });
}
