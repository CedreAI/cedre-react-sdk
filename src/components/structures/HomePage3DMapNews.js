import React from 'react'
import { _t } from '../../languageHandler';
import QuestionDialog from '../views/dialogs/QuestionDialog';



function HomePage3DMapNews(props) {
    const onFinished = () => {
        props.onFinished();
    };
    console.log("HomePage3DMapNews", props)
    return <QuestionDialog
        className="mx_FeedbackDialog"
        hasCancelButton={true}
        title={props.title}
        description={<React.Fragment>
            {/* <h3>{props.title}</h3> */}
            <p>دسته بندی خبر : {props.category}</p>
            <p>محل خبر : {props.place.name}</p>
            <img src={props.image} style={{width:200}}/>
            <hr/>
            <span>{props.text}</span>
            <hr/>
            <a target={'_blank'} href={props.source_url}>منبع خبر : {props.source_name}</a>
        </React.Fragment>}
        // button={_t("Go back")}
        // buttonDisabled={true}
        onFinished={onFinished}
    />;
}




export default HomePage3DMapNews;