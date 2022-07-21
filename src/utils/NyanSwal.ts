import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NyanCat from "../gif/nyan-cat.gif";

const NyanSwal = withReactContent(Swal);

const NyanAlert = () => {
  NyanSwal.fire({
    // title: "Custom width, padding, color, background.",
    showCancelButton: false,
    showConfirmButton: false,
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "transparent",
    backdrop: `
      rgba(0,0,123,0.4)
      url(${NyanCat})
      left top
      no-repeat
    `,
  });
};

export { NyanAlert, NyanSwal };
