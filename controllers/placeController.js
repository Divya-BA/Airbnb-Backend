const Place = require("../models/Place");

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      guestAccess,
      maxGuests,
      price,
    } = req.body;
    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      guestAccess,
      maxGuests,
      price,
    });
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;
    res.status(200).json(await Place.find({ owner: id }));
  } catch (err) {
    res.status(500).json({
      message: "Internal serever error",
    });
  }
};

// Updates a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      guestAccess,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.findById(id);
    if (userId === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        guestAccess,
        maxGuests,
        price,
      });
      await place.save();
      res.status(200).json({
        message: "place updated!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      places,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(400).json({
        message: "Place not found",
      });
    }
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal serever error",
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;
    const guests = req.query.guests || 0;
    if (searchword === "") return res.status(200).json(await Place.find());

    const searchMatches = await Place.find({
      address: { $regex: searchword, $options: "i" },
      maxGuests: { $gte: guests },
    });

    res.status(200).json(searchMatches);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal serever error 1",
    });
  }
};

// Delete a place
exports.deletePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const { id } = req.params;

    const place = await Place.findById(id);
    if (!place) {
      return res.status(400).json({
        message: "Place not found",
      });
    }

    if (userId === place.owner.toString()) {
      await Place.findByIdAndDelete(id);
      res.status(200).json({
        message: "Place deleted!",
      });
    } else {
      res.status(403).json({
        message: "Unauthorized to delete this place",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};
