function EtakiSchedule(data) {
    return  <div>
                <p>schedule</p>
                <p>{ JSON.stringify(data) }</p>
            </div>
}

export async function getServerSideProps() {
    
    let data = { "foo": "bar" }
  
    // Pass data to the page via props
    return { props: data }
}

export default EtakiSchedule