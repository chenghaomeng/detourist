import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Chip,
  Paper,
  Box,
  Typography,
  LinearProgress,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Navigation,
  LocationOn,
  Star,
  Terrain,
  Park,
  DirectionsCar,
  Schedule,
  Route as RouteIcon,
  Visibility,
  Info,
  PlayArrow,
  Settings,
  Favorite,
  Share,
  ArrowBack,
} from "@mui/icons-material";

type FlowStep =
  | "search"
  | "processing"
  | "thinking"
  | "routes"
  | "detail"
  | "navigation";

interface RouteOption {
  id: string;
  title: string;
  score: number;
  duration: string;
  distance: string;
  detour: string;
  tags: string[];
  description: string;
  waypoints: string[];
  scoreBreakdown: {
    scenic: number;
    safety: number;
    duration: number;
    quiet: number;
  };
}

interface NaturalSearchFlowProps {
  searchQuery: string;
  isSemanticMode: boolean;
}

const routeOptions: RouteOption[] = [
  {
    id: "1",
    title: "Most Scenic",
    score: 0.87,
    duration: "42 min",
    distance: "28.3 mi",
    detour: "+18%",
    tags: ["via Golden Gate Park", "coastal views", "tree-lined"],
    description: "Beautiful route through parks and along the waterfront",
    waypoints: ["Golden Gate Park", "Ocean Beach", "Lands End", "Presidio"],
    scoreBreakdown: {
      scenic: 0.92,
      safety: 0.85,
      duration: 0.75,
      quiet: 0.88,
    },
  },
  {
    id: "2",
    title: "Balanced Route",
    score: 0.74,
    duration: "35 min",
    distance: "24.1 mi",
    detour: "+8%",
    tags: ["some highways", "moderate views", "efficient"],
    description: "Good compromise between speed and scenery",
    waypoints: ["19th Avenue", "Park Presidio", "Golden Gate Bridge"],
    scoreBreakdown: {
      scenic: 0.68,
      safety: 0.82,
      duration: 0.91,
      quiet: 0.55,
    },
  },
  {
    id: "3",
    title: "Fastest Route",
    score: 0.61,
    duration: "29 min",
    distance: "22.8 mi",
    detour: "0%",
    tags: ["highways", "direct", "minimal stops"],
    description: "Most direct path with highway segments",
    waypoints: ["US-101 N", "I-80 W", "Richmond Bridge"],
    scoreBreakdown: {
      scenic: 0.35,
      safety: 0.78,
      duration: 0.95,
      quiet: 0.35,
    },
  },
];

export function NaturalSearchFlow({
  searchQuery,
  isSemanticMode,
}: NaturalSearchFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("search");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState("Forest Hills, SF");
  const [destination, setDestination] = useState("");
  const [processingText, setProcessingText] = useState("");

  // Auto-progress through processing when search is submitted
  useEffect(() => {
    if (searchQuery && currentStep === "search") {
      setCurrentStep("processing");
      setProcessingText("Processing request");

      // Extract destination from query
      setTimeout(() => {
        if (searchQuery.toLowerCase().includes("marin")) {
          setDestination("Marin County, CA");
        } else if (searchQuery.toLowerCase().includes("downtown")) {
          setDestination("Downtown San Francisco, CA");
        } else {
          setDestination("Golden Gate Bridge, SF");
        }
        setProcessingText(
          "We found a calm, scenic route from Forest Hills to your destination"
        );

        setTimeout(() => {
          setCurrentStep("thinking");
        }, 2000);
      }, 1500);
    }
  }, [searchQuery, currentStep]);

  // Handle thinking step timer
  useEffect(() => {
    if (currentStep === "thinking") {
      const timer = setTimeout(() => {
        setCurrentStep("routes");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId);
    setCurrentStep("detail");
  };

  const renderSearchEntry = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Natural Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Describe what you want to find — not just a place or address.
        </Typography>
      </Box>

      <TextField
        fullWidth
        value={searchQuery}
        placeholder="Scenic drive through parks to the coast"
        variant="outlined"
        size="medium"
        InputProps={{ readOnly: true }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Try: "Avoid highways, prefer tree-lined streets"
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Try: "Calm route with mountain views"
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Try: "Shortest path through downtown"
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Search />}
        onClick={() => searchQuery && setCurrentStep("processing")}
        disabled={!searchQuery}
      >
        Generate Route Ideas
      </Button>
    </Box>
  );

  const renderProcessingBanner = () => (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 2,
          backgroundColor: "primary.light",
          borderColor: "primary.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Box>
            <Typography variant="subtitle2">Processing request</Typography>
            <Typography variant="body2" color="text.secondary">
              {processingText}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );

  const renderThinkingStep = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <CircularProgress size={64} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Analyzing Your Request
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Understanding your preferences and finding the best routes...
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 2, backgroundColor: "grey.50" }}>
          <Typography variant="subtitle2" gutterBottom>
            What I understood:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }}
              />
              <Typography variant="body2">Origin: Forest Hills, SF</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }}
              />
              <Typography variant="body2">Destination: {destination}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }}
              />
              <Typography variant="body2">
                Preferences: Scenic, quiet, avoid highways
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={8} />
              <Typography variant="body2">Calculating optimal routes...</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, backgroundColor: "primary.light" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Star color="primary" fontSize="small" />
            <Typography variant="subtitle2" color="primary">
              AI Route Intelligence
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Analyzing thousands of route combinations to find paths that match your
            scenic and quiet street preferences while avoiding major highways.
          </Typography>
        </Paper>
      </Box>
    );
  };

  const renderRoutesWithConfirmation = () => (
    <Box sx={{ p: 3 }}>
      {/* Route Fields */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "grey.50" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <LocationOn fontSize="small" sx={{ mr: 1 }} />,
            }}
          />
          <TextField
            fullWidth
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Navigation fontSize="small" sx={{ mr: 1 }} />,
            }}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip icon={<Terrain />} label="Scenic" size="small" />
            <Chip icon={<Park />} label="Quiet" size="small" />
            <Chip icon={<DirectionsCar />} label="Avoid Highways" size="small" />
          </Box>
        </Box>
      </Paper>

      {/* Route Options */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {routeOptions.map((route) => (
          <Paper
            key={route.id}
            sx={{
              p: 2,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
              },
            }}
            onClick={() => handleRouteSelect(route.id)}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Box>
                <Typography variant="subtitle1">{route.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Star fontSize="small" sx={{ color: "warning.main" }} />
                  <Typography variant="body2" color="text.secondary">
                    Score {route.score.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Chip label={route.detour} size="small" variant="outlined" />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Schedule fontSize="small" />
                <Typography variant="body2">{route.duration}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <RouteIcon fontSize="small" />
                <Typography variant="body2">{route.distance}</Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {route.description}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              {route.tags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" variant="filled" />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                sx={{ flex: 1 }}
              >
                Preview
              </Button>
              <IconButton size="small" sx={{ border: "1px solid", borderColor: "divider" }}>
                <Info fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );

  const renderRouteDetail = () => {
    const route = routeOptions.find((r) => r.id === selectedRoute);
    if (!route) return null;

    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => setCurrentStep("routes")}
          sx={{ mb: 2 }}
        >
          Back to routes
        </Button>

        <Typography variant="h6" gutterBottom>
          {route.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {route.duration}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {route.distance}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {route.detour} detour
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          <Chip icon={<Terrain />} label="Scenic ✓" size="small" color="success" />
          <Chip icon={<Park />} label="Quiet ✓" size="small" color="success" />
          <Chip
            icon={<DirectionsCar />}
            label="Avoid Highways ✓"
            size="small"
            color="success"
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Route Waypoints
        </Typography>
        <Box sx={{ mb: 3 }}>
          {route.waypoints.map((waypoint, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body2">{waypoint}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Route Score Breakdown
        </Typography>
        <Box sx={{ mb: 3 }}>
          {Object.entries(route.scoreBreakdown).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                  {key}
                </Typography>
                <Typography variant="body2">{(value * 100).toFixed(0)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={value * 100} />
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          sx={{ mb: 2 }}
        >
          Start Navigation
        </Button>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<Settings />}>
            Refine
          </Button>
          <Button variant="outlined" size="small" startIcon={<Favorite />}>
            Save
          </Button>
          <Button variant="outlined" size="small" startIcon={<Share />}>
            Share
          </Button>
        </Box>
      </Box>
    );
  };

  // If not in semantic mode, show empty state
  if (!isSemanticMode) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Search sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Enable Semantic Mode
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Turn on semantic mode to use natural language route descriptions
        </Typography>
      </Box>
    );
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "search":
        return renderSearchEntry();
      case "processing":
        return renderProcessingBanner();
      case "thinking":
        return renderThinkingStep();
      case "routes":
        return renderRoutesWithConfirmation();
      case "detail":
        return renderRouteDetail();
      default:
        return renderSearchEntry();
    }
  };

  return <Box sx={{ height: "100%" }}>{renderCurrentStep()}</Box>;
}
