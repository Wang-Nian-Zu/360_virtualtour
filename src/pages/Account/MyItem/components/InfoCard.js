// import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';


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
            <th>展出中的展品</th>
            <th>目前你所創建的展品有多少正在展示中</th>
            <th>{count3}</th>
          </tr>
          <tr>
            <th>待展出的展品</th>
            <th>目前你所創建的展品有多少已經被展場引用但尚未展出</th>
            <th>{count2}</th>
          </tr>
          <tr>
            <th>尚未使用的展品</th>
            <th>目前你所創建的展品有多少尚未被任何展場所引用</th>
            <th>{count1}</th>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default InfoCard;