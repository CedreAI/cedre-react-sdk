import React from 'react'
import { _t } from '../../languageHandler';
import QuestionDialog from '../views/dialogs/QuestionDialog';



function HomePage3DMapNews(props) {
    const onFinished = ()=> {
        props.onFinished();
    };
    return <QuestionDialog
    className="mx_FeedbackDialog"
    hasCancelButton={true}
    title={"آخرین اخبار "+props.name}
    description={<React.Fragment>
        در حال آماده سازی
    </React.Fragment>}
    // button={_t("Go back")}
    // buttonDisabled={true}
    onFinished={onFinished}
/>;
}




export default HomePage3DMapNews;