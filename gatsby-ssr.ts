import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import { GatsbySSR } from "gatsby";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setBodyAttributes }) => {
    setBodyAttributes({ 'data-bs-theme': 'dark' } as Record<string, string>);
};
