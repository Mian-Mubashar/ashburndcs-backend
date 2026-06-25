// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import tw from "twin.macro";
// import { css } from "styled-components/macro"; //eslint-disable-line
// import { useNavigate } from "react-router-dom";
// import { Toast } from "helpers/Alert";
// import axios from "axios";

// ... (other imports)
// const Container = tw.div`relative`;
// const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

// const FormContainer = styled.div`
//   ${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
//   form {
//     ${tw`mt-4`}
//   }
//   h2 {
//     ${tw`text-3xl sm:text-4xl font-bold`}
//   }
//   input,
//   textarea {
//     ${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

//     ::placeholder {
//       ${tw`text-gray-500`}
//     }
//   }
// `;

// const TableContainer = styled.div`
//   ${tw`mt-8`}
//   table {
//     ${tw`min-w-full bg-white border border-gray-300`}
//   }
//   th, td {
//     ${tw`py-2 px-4 border-b`}
//   }
// `;

// // ... (rest of the component)

// export default () => {
//   // ... (existing code)

//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:4200/api/learning/view").then((response) => {
//       setTableData(response?.data);
//     });
//   }, []);
// console.log(tableData.data)
//   return (
//     <Container>
//       <Content>
//       <FormContainer>
//           <div tw="mx-auto max-w-4xl">
//             <h2>Edit & Delete Data</h2>
//           </div>
//         </FormContainer>

//         {/* Table section */}
//         <TableContainer>
//         <div tw="mt-16">
//           {/* <h2 className="text-3xl font-bold mb-4">Table Data</h2> */}
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="py-2 px-4 border-b">Heading</th>
//                 <th className="py-2 px-4 border-b">subHeading</th>
//                 <th className="py-2 px-4 border-b">Action</th>

//               </tr>
//             </thead>
//             <tbody>
//               {tableData?.data?.map((row) => (
//                 <tr key={row.id}>
//                   <td className="py-2 px-4 border-b">{row?.heading}</td>
//                   <td className="py-2 px-4 border-b">{row?.subHeading}</td>
//                   <td className="py-2 px-4 border-b">{row?.description}</td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//           {/* <h2>Table Data</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Heading</th>
//                 <th>Sub Heading</th>
//                 <th>Description</th>
//                 <th>Button Text</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableData?.data?.map((rowData) => (
//                 <tr key={rowData?.id}>
//                   <td>{rowData?.heading}</td>
//                   <td>{rowData?.subHeading}</td>
//                   <td>{rowData?.description}</td>
//                   <td>{rowData?.primaryButtonText}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table> */}
//         </TableContainer>

//       </Content>
//     </Container>
//   );
// };
/* eslint-disable jsx-a11y/no-redundant-roles */
const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

export default () => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {people.map((person) => (
        <li key={person.email} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={person.imageUrl}
              alt=""
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {person.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {person.email}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{person.role}</p>
            {person.lastSeen ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen{" "}
                <time dateTime={person.lastSeenDateTime}>
                  {person.lastSeen}
                </time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
