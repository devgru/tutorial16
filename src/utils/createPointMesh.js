import React from 'react';

const pointSize = 1.5;

const projectToPlane = (point, plane) => {
  const { centroid, normal } = plane;
  point.sub(
    normal.clone().multiplyScalar(normal.dot(point.clone().sub(centroid)))
  );
};

export default function createPointMesh(
  colorToPoint,
  color,
  a = 1,
  plane = null
) {
  const colorHex = color.hex();
  const point = colorToPoint(color);
  if (plane) {
    projectToPlane(point, plane);
  }

  return (
    <mesh key={`${colorHex}-${a}`} position={point}>
      <meshBasicMaterial transparent opacity={a} color={colorHex} />
      <sphereGeometry radius={pointSize} />
    </mesh>
  );
}
