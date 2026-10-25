# API Endpoint Documentation

Base URL: `/api/v1`

## Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register new user account | No |
| POST | `/auth/login` | Sign in with email & password | No |
| POST | `/auth/logout` | Terminate session | No |
| POST | `/auth/refresh` | Refresh JWT access token | Yes (Bearer) |

## Users & Profiles
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/users/me` | Fetch authenticated user profile | Yes |
| PUT | `/users/me` | Update travel preferences & info | Yes |

## Trips
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/trips` | Create a new trip plan | Yes |
| GET | `/trips` | List all trips accessible to user | Yes |
| GET | `/trips/{trip_id}` | Fetch detailed trip by ID | Yes |
| PUT | `/trips/{trip_id}` | Update trip attributes | Yes |
| DELETE | `/trips/{trip_id}` | Permanently delete trip | Yes |
| POST | `/trips/{trip_id}/generate` | Generate complete AI itinerary | Yes |
| POST | `/trips/{trip_id}/share` | Invite group collaborator | Yes |

## Itineraries & Activities
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/itineraries/{trip_id}` | Fetch full itinerary with days | Yes |
| POST | `/itineraries/{trip_id}/days/{day_number}/regenerate` | Regenerate specific day schedule | Yes |
| POST | `/itineraries/{trip_id}/days/{itinerary_id}/activities` | Add custom activity to day | Yes |
| PUT | `/itineraries/{trip_id}/activities/{activity_id}` | Update scheduled activity | Yes |
| DELETE | `/itineraries/{trip_id}/activities/{activity_id}` | Remove activity from day | Yes |

## Recommendations & Health
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/recommendations/{trip_id}` | Get curated attractions & hotels | Yes |
| GET | `/health` | Server health & database status | No |
