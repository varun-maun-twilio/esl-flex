import { styled } from '@twilio/flex-ui';

export const TaskSearchViewViewWrapper = styled('div')`
  display: flex;
  height: 100%;
  overflow-y: scroll;
  flex-flow: column;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const SearchTasksTable = styled.table`
width:100%;
zoom: 1;
td{
    padding:10px;
    vertical-align: bottom;
}

td.btn{
    text-align:center;
}
`;


export const SearchResultsTable = styled('table')`
width: 100%;
border-collapse: collapse;


th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size:12px;
}

thead{
    position: sticky;
      top: 0;
      z-index: 10;
}

th {
  background-color: #f2f2f2;
  font-size:12px;
  font-weight:bold;
}

td:first-child,th:first-child,td:last-child,th:last-child{
  text-align:center;
}

tr.even-row {
    background:#fcfcfc;
}

tr.selected{
    background:#c9e0ff;
}


`;