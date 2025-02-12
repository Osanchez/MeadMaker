import { createContext } from "react";

export const ActionModalContext = createContext({
    actionModalVisible: false,
    setActionModalVisible: (visible) => {},
});
