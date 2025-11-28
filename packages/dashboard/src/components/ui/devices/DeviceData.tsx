import style from "./DeviceData.module.scss"



interface DeviceDataInterface {
    name: string
    location: string
}

const DeviceData = (props: DeviceDataInterface) => {
    return (
        <div className={style.DeviceData}>
            <div className={style.Wrap}>
                <p>
                    {props.name}
                </p>
                <p>
                    {props.location}
                </p>
            </div>
        </div>
    )
}

export default DeviceData