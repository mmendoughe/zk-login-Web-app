function Submit (props) {
      const prov = props.provider;
      const address = prov.getAddress();
      return (
        <div>
            <h>
                  {address}
            </h>
        </div>
      );
}

export default Submit;