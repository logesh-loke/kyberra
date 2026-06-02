// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";


// export const startDashboardHeaderTour = () => {
// const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
// const passkeyTour = localStorage.getItem("passkeyTour");

// if (userDetails.login_status === "true" || passkeyTour === "true") return;
//   const d = driver({
//     showProgress: false,
//     allowClose: true,
//     allowInteraction: true,
//     showButtons: ["close"],

//     steps: [
//       {
//         element: "#header-profile-button",
//         popover: {
//           title: "Open your profile",
//           description:
//             "Click this button to open your profile card and manage your account.",
//           side: "bottom",
//           align: "end",
//         },
//       },
//     ],
//   });

//   d.drive();
// };

// /**
//  * 2) Second tour – Profile item inside ProfileCard
//  */
// export const startProfileMenuTour = () => {
// const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
// const passkeyTour = localStorage.getItem("passkeyTour");

// if (userDetails.login_status === "true" || passkeyTour === "true") return;
//   const d = driver({
//     showProgress: false,
//     allowClose: true,
//     allowInteraction: true,
//     showButtons: ["close"],

//     steps: [
//       {
//         element: "#profile-menu-profile",
//         popover: {
//           title: "Go to your profile",
//           description: "Now click on ‘Profile’ to open your profile page.",
//           side: "right",
//           align: "center",
//         },
//       },
//     ],
//   });

//   d.drive();
// };

// /**
//  * 3) Third tour – passkey section on /profile page (unchanged)
//  */
// // export const startProfilePasskeyTour = () => {
// // const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
// // const passkeyTour = localStorage.getItem("passkeyTour");

// // if (userDetails.login_status === "true" || passkeyTour === "true") return;
// //   const d = driver({
// //     showProgress: false,
// //     allowClose: false,
// //     allowInteraction: true,
// //     showButtons: ["close"],

// //     steps: [
// //       {
// //         element: "#profile-passkey-section",
// //         popover: {
// //           title: "Create your passkey",
// //           description:
// //             "Paste the token sent to your registered Gmail here and click 'Create Passkey'. This passkey will be used to decrypt your messages.",
// //           side: "top",
// //           align: "start",
// //         },
// //       },
// //     ],
// //   });

// //   d.drive();
// // };


// // export const startProfilePasskeyFormTour = () => {
// // const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
// // const passkeyTour = localStorage.getItem("passkeyTour");

// // if (userDetails.login_status === "true" || passkeyTour === "true") return;
// //   const d = driver({
// //     showProgress: false,
// //     allowClose: true,
// //     allowInteraction: true,
// //     showButtons: ["close"],

// //     steps: [
// //       {
// //         element: "#profile-passkey-section",
// //         popover: {
// //           title: "Fill your passkey details",
// //           description:
// //             "Paste the token from your email and enter your new passkey, then save it.",
// //           side: "top",
// //           align: "start",
// //         },
// //       },
// //     ],
// //   });

// //   d.drive();
// // };

