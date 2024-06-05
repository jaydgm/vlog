import React from 'react'

const SchedulerModal=({ handleModal }) => {

    return (
        <>
            {/* Bootstrap Modal */}
            {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Item</h5>
                <button type="button" className="btn-close" onClick={handleModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Add your form or content for adding item here */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                {/* Add button to save item here */}
                <SchedulerModal handleModale={handleModal}/>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
    )
}