import Table from 'react-bootstrap/Table';
import '../index.css';

const InfoCard = (props) => {
  const { count1 } = props;
  const { count2 } = props;
  const { count3 } = props;

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>類別</th>
            <th>描述</th>
            <th>數量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>展出中的全景圖</th>
            <th>目前你所創建的全景圖已用於展場的數量</th>
            <th>{count3}</th>
          </tr>
          <tr>
            <th>待展出的全景圖</th>
            <th>目前你所創建的全景圖已用於尚未展出的展場的數量</th>
            <th>{count2}</th>
          </tr>
          <tr>
            <th>尚未使用的全景圖</th>
            <th>目前你所創建的全景圖中尚未使用的數量</th>
            <th>{count1}</th>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default InfoCard;