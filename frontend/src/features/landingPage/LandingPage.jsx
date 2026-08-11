import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Cta } from "./Cta";

const features = [
    {
        featurePageNumber: "1",
        featureTitle: "Everything You Need to Manage Your Files",
        featureDescription: "Keep your digital workspace organized with quick access to the files you need. Upload, search, sort, preview, download, and manage your files—all from one clean, intuitive interface.",
        featureImg: "/public/search-and-sort-cloud-vault.png",
    },
    {
        featurePageNumber: "2",
        featureTitle: "Let AI Make Your Files Smarter",
        featureDescription: "Get quick, useful summaries of lengthy documents and automatically categorize files based on their content, making it easier to find what matters and keep your digital workspace organized.",
        featureImg: "/public/coming-soon-cloud-vault.png",
    },
]

export function LandingPage() {
    return (
        <>
            <Navbar></Navbar>
            <Hero></Hero>
            {features.map((feature) => {
                return <Features featurePageNumber={feature.featurePageNumber} featureTitle={feature.featureTitle} featureDescription={feature.featureDescription} featureImg={feature.featureImg}></Features>
            })}
            <Cta></Cta>
        </>
    );
}