export const ProgressBar: React.FC = () => {
    return <div className="progress-bar">
        <div className="progress" style={{ width: `${"progressPercentage"}%` }}></div>
        <div className="current-time">{"currentTime"}</div>
    </div>
}

export default ProgressBar;