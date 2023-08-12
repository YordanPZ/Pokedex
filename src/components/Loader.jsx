import "./Loader.css"

function Loader() {
  return (
    <div className="container__loader">
      <div className="circ">
        <div className="load">Loading . . . </div>
        <div className="hands"></div>
        <div className="body"></div>
        <div className="head">
          <div className="eye"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
