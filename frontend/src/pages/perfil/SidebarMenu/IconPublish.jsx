import SidebarLink from "./SideBarLink.jsx";
import { FaPlusSquare } from "react-icons/fa";
import useEventsModals from "../hooks/useEventsModals";
import { useTranslation } from "react-i18next";

const IconPublish = () => {
    const { t } = useTranslation();

    const { handlePublishClick } = useEventsModals();

    return (
        <>
            <SidebarLink
                title={t("publish_title")}
                icon={<FaPlusSquare />}
                label={t("publish_label")}
                onClick={handlePublishClick}
            />
        </>
    );
};

export default IconPublish;
