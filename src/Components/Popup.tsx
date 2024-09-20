
import "../App.css";

function Popup(props: any) {
    return (props?.trigger) ? (
        <div className='UpdateAuthorForm flex-col mt-3'>
            <button onClick={() => props.setTrigger(false)} className="bg-red-500 p-1 rounded-md justify-end">close</button>
            {props.children}
        </div>
    ) : "";
}

export default Popup