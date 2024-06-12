import { useEffect, useMemo, useState } from "react";
import { Appear, Table, Paragraph } from "arwes";

const buttonStyle = {
  background: "none",
  border: "none",
  color: "#26DAFD",
  fontWeight: "bold",
  cursor: "pointer",
}
const History = props => {
  const [currentPage, setCurrentPage] = useState(1)
  const [launches, setLaunches] = useState([])

  useEffect(() => {
    async function getPaginatedData() {
      const data = await props.paginateLaunches({page: currentPage, limit: 10})
      setLaunches(data)
    }
    getPaginatedData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const tableBody = useMemo(() => {
    return launches.filter((launch) => !launch.upcoming)
      .map((launch) => {
        return <tr key={String(launch.flightNumber)}>
          <td>
            <span style={
              {color: launch.success ? "greenyellow" : "red"}
            }>█</span>
          </td>
          <td>{launch.flightNumber}</td>
          <td>{new Date(launch.launchDate).toDateString()}</td>
          <td>{launch.mission}</td>
          <td>{launch.rocket}</td>
          <td>{launch.customers?.join(", ")}</td>
        </tr>;
      });
  }, [launches]);

  return <article id="history">
    <Appear animate show={props.entered}>
      <Paragraph>History of mission launches including SpaceX launches starting from the year 2006.</Paragraph>
      <Table animate>
        <table style={{tableLayout: "fixed"}}>
          <thead>
            <tr>
              <th style={{width: "3rem"}}></th>
              <th style={{width: "4rem"}}>No.</th>
              <th style={{width: "9rem"}}>Date</th>
              <th>Mission</th>
              <th style={{width: "7rem"}}>Rocket</th>
              <th>Customers</th>
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
          <tfoot>
            <td colspan="2">
              <button style={buttonStyle} onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}>
              {'<< Previous'}
              </button>
            </td>
            <td colspan="2" style={{ textAlign: "center" }}>
              <span>Current Page: {currentPage}</span>
            </td>
            <td colspan="2" style={{ textAlign: "right" }}>
              <button style={buttonStyle} onClick={() => setCurrentPage((old) => old + 1 )}>
                {'Next >>'}
              </button>
            </td>
          </tfoot>
        </table>
      </Table>
    </Appear>
  </article>;
}
  
export default History;