// ! DEPRICATED CODE.
// // ===============================================================================================
// // Table controls for Tiptap used for adding rows and columns to the table after inserting a table
// // ===============================================================================================

// "use client";
// import React, { useEffect, useState } from 'react';
// import { Editor } from '@tiptap/react';
// import {
//   PlusCircleIcon,
//   MinusCircleIcon,
// } from '@heroicons/react/24/outline';

// // Table controls component
// export default function TableControls({ editor }: { editor: Editor }) {
//   const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
//   const [open, setOpen] = useState(false);

//   // Update the button position when the table is inserted
//   useEffect(() => {
//     const update = () => {
//       if (!editor.isActive('table')) { setButtonPos(null); return; }
//       const table = editor.view.dom.querySelector('table') as HTMLElement | null;
//       if (!table) { setButtonPos(null); return; }
//       const rect = table.getBoundingClientRect();
//       // Position the icon on the left side of the table, slightly offset
//       setButtonPos({ top: rect.top + window.scrollY - 8, left: rect.left + window.scrollX - 32 });
//     };
//     update();
//     window.addEventListener('scroll', update, true);
//     editor.on('selectionUpdate', update);
//     return () => {
//       window.removeEventListener('scroll', update, true);
//       editor.off('selectionUpdate', update);
//     };
//   }, [editor]);

//   // If the button position is not set, return null
//   if (!buttonPos) return null;

//   const run = (cmd: () => any) => { cmd(); setOpen(false); };

//   // Return the table controls component
//   return (
//     <div>
//       {/* Table controls button */}
//       <button
//         className="fixed z-40 bg-blue-500 hover:bg-blue-600 text-white w-7 h-7 rounded-full font-bold flex items-center justify-center shadow-lg transition-colors"
//         style={{ top: buttonPos.top, left: buttonPos.left }}
//         onClick={() => setOpen(o => !o)}
//         aria-label="Table options"
//         title="Table options"
//       >
//         <PlusCircleIcon className="w-5 h-5" />
//       </button>

//       {/* Table controls menu */}
//       {open && (
//         <div className="fixed z-50 bg-white border rounded shadow p-2 text-sm" style={{ top: buttonPos.top, left: buttonPos.left + 32 }}>
//           {/* Add row below */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
//             onClick={() => run(() => editor.chain().focus().addRowAfter().run())}>
//             <img src="/rte-editor/Add-Row.svg" alt="youtube" width={22} height={22} />
//             Add row below
//           </button>

//           {/* Add row above */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
//             onClick={() => run(() => editor.chain().focus().addRowBefore().run())}>
//             <img src="/rte-editor/Add-Row.svg" alt="youtube" width={22} height={22} />
//             Add row above
//           </button>

//           {/* Add column right */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
//             onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}>
//             <img src="/rte-editor/Add-column.svg" alt="youtube" width={22} height={22} />
//             Add column right
//           </button>

//           {/* Add column left */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
//             onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}>
//             <img src="/rte-editor/Add-column.svg" alt="youtube" width={22} height={22} />
//             Add column left
//           </button>

//           {/* Divider */}
//           <hr className="my-2" />

//           {/* Delete row */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-600 hover:bg-red-50"
//             onClick={() => run(() => editor.chain().focus().deleteRow().run())}>
//             <img src="/rte-editor/Delete-Row.svg" alt="youtube" width={22} height={22} />
//             Delete row
//           </button>

//           {/* Delete column */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-600 hover:bg-red-50"
//             onClick={() => run(() => editor.chain().focus().deleteColumn().run())}>
//               <img src="/rte-editor/Delete-column.svg" alt="youtube" width={22} height={22} />
//             Delete column
//           </button>

//           {/* Delete table */}
//           <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-700 font-semibold hover:bg-red-100"
//             onClick={() => run(() => editor.chain().focus().deleteTable().run())}>
//             <img src="/rte-editor/Delete-table.svg" alt="youtube" width={22} height={22} />
//             Delete table
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
