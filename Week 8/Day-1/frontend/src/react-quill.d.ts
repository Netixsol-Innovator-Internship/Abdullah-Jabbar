/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-quill-new" {
  const ReactQuill: any;
  export default ReactQuill;
}

// keep fallback for older imports
declare module "react-quill" {
  const ReactQuill: any;
  export default ReactQuill;
}
