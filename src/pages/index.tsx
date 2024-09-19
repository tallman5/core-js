import React from "react"
import Layout from "../components/layout";
import { Link } from "gatsby";

const HomePage = () => {

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className="col">
            <h1>core-js Test Site</h1>
            <p>This site is used simply for testing some of the core-js components</p>
            <table className="table">
              <tbody>
                <tr>
                  <td><Link to="/monaco">Monaco Grammers</Link></td>
                  <td>Loading of custom grammers such as Klipper</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage