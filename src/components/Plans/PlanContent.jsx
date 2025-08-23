import { useUserContext } from "../../provider/UserProvider";
import { FaPencilAlt } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import PropTypes from "prop-types";
import { deletePlan } from "./api";
import { useState } from "react";

const PlanContent = ({ id, content, reload }) => {
  const { user } = useUserContext();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePlan(user.uid, id);
      reload();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
      <p className="mb-0 text-center text-md-start" style={{ wordBreak: "break-word" }}>
        {content}
      </p>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : <FcLike size={20} />}
        </button>
        <button className="btn btn-outline-warning btn-sm" disabled>
          <FaPencilAlt size={16} /> {/* botón futuro editar */}
        </button>
      </div>
    </div>
  );
};

PlanContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  reload: PropTypes.func,
};

export default PlanContent;
