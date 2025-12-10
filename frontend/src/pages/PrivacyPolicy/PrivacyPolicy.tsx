import { useEffect } from "react"
import styles from "./PrivacyPolicy.module.css"
import { Link } from "react-router-dom";
const PrivacyPolicy = () => {

    return (
        <>
       
        <div className={styles.page}>
            <Link to={"/"} >{"<"} Back</Link>
            <h1>Privacy Policy</h1>
            <section id="dati-personali" className={styles.section}>
                <h3 className={styles.title}>Personal Data</h3>
                <p>We collect and store the following personal data:</p>
                <p>- Email</p>
                <p>- Password</p>
                <p>This data is required to provide our Services and they will be preserved until the Account will be deleted. </p>
                <p>We have the right to inspect and delete your data if we deem it appropriate.</p>
                <p>The user can request a copy of his data stored in our System.</p>
                <p>The data stored in our system will be not shared or sold to anyone else.</p>
           
            </section>
            <section className={styles.section}>
                <h3 className={styles.title}>Usage Data</h3>
                <p>We also collect other type of data (such as name and profile image), You provide us, this data is public, so anyone has access to it</p>
                <p>You can request a copy of this data. When the acccount is deleted, they will be completly and permanently deleted</p>
            </section>
            <section className={styles.section}>
                <h3 className={styles.title}>Third party services</h3>
                <p>We provide the option to use Google to login</p>
                <p>Images and other files are stored on Cloudinary.</p>
                <p>For more information check out their privacy policy: </p>
                <div className={styles.links}>
                    <div>
                        <a href="https://policies.google.com/privacy">google policy</a>
                    </div>
                    <div>
                        <a href="https://cloudinary.com/privacy">cloudinary policy</a>
                    </div>
                </div>
           </section>
        </div>
        </>
    )
}
export default PrivacyPolicy