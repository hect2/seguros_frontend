const FIELD_LABELS: Record<string, string> = {
  "full_name": "Nombre completo",
  "dpi": "DPI",
  "email": "Correo electrónico",
  "phone": "Teléfono",
  "birth_date": "Fecha de nacimiento",

  "status.name": "Estado",

  "positions.*.initial_salary": "Salario base",
  "positions.*.bonuses": "Bonificaciones",
  "positions.*.status": "Estado del puesto",

  "positions.*.office.code": "Oficina",
  "positions.*.district.code": "Distrito",

  "positions.*.admin_position_type.name": "Tipo de puesto administrativo",
  "positions.*.operative_position_type.name": "Tipo de puesto operativo",
};

const EXCLUDED_PATHS = [
  "id",
  "status_id",
  "created_at",
  "updated_at",

  "status.id",
  "status.slug",
  "status.created_at",
  "status.updated_at",
  "status.description",
  
  "positions.*.id",
  "positions.*.district.id",
  "positions.*.updated_at",
  "positions.*.district_id",
  "positions.*.admin_position_type.id",
  "positions.*.admin_position_type_id",
  "positions.*.operative_position_type.id",
  "positions.*.operative_position_type_id",

  "trackings",
];

const matchPath = (path: string, rule: string) => {
  const regex = new RegExp(
    "^" + rule.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$"
  );
  return regex.test(path);
};

const normalizePath = (path: string) =>
  path.replace(/\.\d+/g, ".*");

const resolveFieldLabel = (path: string): string => {
  const normalizedPath = normalizePath(path);

  for (const rule in FIELD_LABELS) {
    if (matchPath(normalizedPath, rule)) {
      return FIELD_LABELS[rule];
    }
  }

  // fallback: último segmento del path
  return path.split(".").pop() ?? path;
};


const isExcluded = (path: string) =>
  EXCLUDED_PATHS.some((rule) => matchPath(path, rule));

export const diffObjects = (
  prev: any,
  current: any,
  basePath = ""
) => {
  let changes: {
    field: string;
    label: string;
    before: any;
    after: any;
  }[] = [];

  if (!prev || !current) return changes;

  // 👉 Si el path base está excluido, salimos
  if (basePath && isExcluded(basePath)) return changes;

  // 👉 MANEJO DE ARRAYS
  if (Array.isArray(current)) {
    current.forEach((item, index) => {
      const path = basePath ? `${basePath}.${index}` : `${index}`;

      if (isExcluded(path)) return;

      changes = changes.concat(
        diffObjects(prev[index], item, path)
      );
    });

    return changes;
  }

  // 👉 MANEJO DE OBJETOS
  Object.keys(current).forEach((key) => {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isExcluded(path)) return;

    const prevValue = prev[key];
    const currValue = current[key];

    if (
      typeof currValue === "object" &&
      currValue !== null
    ) {
      changes = changes.concat(
        diffObjects(prevValue, currValue, path)
      );
    } else if (prevValue !== currValue) {
      changes.push({
        field: path,                         // path técnico
        label: resolveFieldLabel(path),      // 👈 nombre bonito
        before: prevValue,
        after: currValue,
      });
    }
  });

  return changes;
};
