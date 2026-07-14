import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "A Spread").slice(0, 60);
  const a = (searchParams.get("a") ?? "").slice(0, 50);
  const b = (searchParams.get("b") ?? "").slice(0, 50);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#FBF7F2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF4A2E,#FF8A3D)",
            opacity: 0.35,
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF8A3D,#FF4A2E)",
            opacity: 0.25,
            filter: "blur(10px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#FF4A2E",
              letterSpacing: -1,
            }}
          >
            Spread
            <span
              style={{
                marginLeft: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#FF4A2E,#FF8A3D)",
                color: "#fff",
                fontSize: 20,
              }}
            >
              +
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 68,
              fontWeight: 800,
              color: "#171310",
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
              fontSize: 32,
              fontWeight: 700,
              color: "#7C7268",
            }}
          >
            <span style={{ color: "#171310" }}>{a}</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                margin: "0 20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#FF4A2E,#FF8A3D)",
                color: "#fff",
                fontSize: 26,
              }}
            >
              +
            </span>
            <span style={{ color: "#171310" }}>{b}</span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontSize: 24,
              color: "#7C7268",
            }}
          >
            {`A meal ${title} swears by.`}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
