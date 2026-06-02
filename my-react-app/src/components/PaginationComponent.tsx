import Pagination from 'react-bootstrap/Pagination';

function PaginationComponent(props: any) {
    const meta = props.meta

  return (
    <Pagination style={{ display: 'flex', justifySelf: 'center' }}>
      <Pagination.Prev disabled={!(meta?.currentPage > 1)} onClick={props.onPrev} />
      <Pagination.Next disabled={!(meta?.currentPage < meta?.pageCount)} onClick={props.onNext} />
    </Pagination>
  );
}

export default PaginationComponent;