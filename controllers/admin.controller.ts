import { Admin } from "~/models/admin"

// Create and Save a new Todo
exports.create = (req: any, res: any) => {
    const { name = '', password = '', email = '', phone = '', role = '' } = req.body
    // Validate request
    if (!name || !password || !email || !phone || !role) {
      res.status(400).send({ message: 'All field can not be empty!' })
    }
  
    // Create a Todo
    const admin = new Admin({
      name: name,
      password: password,
      email: email,
      phone: phone,
      role: role
    })
  
    // Save Todo in the database
    admin
      .save()
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the Admin.',
        })
      })
  }
  
  // Retrieve all Todos from the database.
  exports.findAll = (req: any, res: any) => {
    Admin.find({})
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving admins.',
        })
      })
  }
  
  // Find a single Todo with an id
  exports.findOne = (req: any, res: any) => {
    const admin = req.body
  
    Admin.findOne({email: admin.email, password: admin.password})
      .then((data) => {
        if (!data)
          res.status(404).send({ message: 'Not found admin with email ' + admin.email })
        else res.send(data)
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error retrieving admin with email =' + admin.email })
      })
  }
  
  // Update a Todo by the id in the request
  exports.update = (req: any, res: any) => {
    if (!req.body) {
      return res.status(400).send({
        message: 'Data to update can not be empty!',
      })
    }
  
    const id = req.params.id
    const todo = req.body
  
    Admin.findByIdAndUpdate(id, todo)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Admin with id=${id}. Maybe Admin was not found!`,
          })
        } else res.send({ message: 'Admin was updated successfully.' })
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Admin with id=' + id,
        })
      })
  }
  
  // Delete a Todo with the specified id in the request
  exports.delete = (req: any, res: any) => {
    const id = req.params.id
  
    Admin.findByIdAndRemove(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Admin with id=${id}. Maybe Admin was not found!`,
          })
        } else {
          res.send({
            message: 'Admin was deleted successfully!',
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete Admin with id=' + id,
        })
      })
  }
  
  // Delete all Todos from the database.
  // exports.deleteAll = (req, res) => {
  //   Todo.deleteMany({})
  //     .then((data) => {
  //       res.send({
  //         message: `${data.deletedCount} Todos were deleted successfully!`,
  //       })
  //     })
  //     .catch((err) => {
  //       res.status(500).send({
  //         message: err.message || 'Some error occurred while removing all todos.',
  //       })
  //     })
  // }