
import { TGoal } from "../../../controllers/goals";
import { TGraph } from "../Graph";
import styles from "./GraphSkeleton.module.css"
function GraphSkeleton({graphs}:{graphs: TGraph[]}) {
    return (
        <div className={styles.skeletons}>
        {graphs.map(graph =>{
            //console.log("hello")
            return (
                <>
                <div className={styles["title-skeleton"]}>
                    <div className={styles.circle}></div>
                </div>
                <div className={styles["graph-skeleton"]} key={graph.goal._id}>
                    <div className={styles.circle}></div>
                </div>
                </>
            )
        })
        }
        </div>
    );
}

export default GraphSkeleton;