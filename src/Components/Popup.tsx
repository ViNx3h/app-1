
function Popup(props: any) {
    return (props?.trigger) ? (
        <div className='UpdateAuthorForm' style={{ backgroundColor: "white" }}>
            <button onClick={() => props.setTrigger(false)} >close</button>
            {props.children}
        </div>
    ) : "";
}

export default Popup