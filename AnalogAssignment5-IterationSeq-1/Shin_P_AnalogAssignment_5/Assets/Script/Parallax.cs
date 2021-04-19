using UnityEngine;

public class Parallax : MonoBehaviour
{
    /* Parallax effect: 
     * https://www.youtube.com/watch?v=zit45k6CUMk
     * https://www.youtube.com/watch?v=zrxAGdwdj1c
     */
    [SerializeField]
    private float moveSpeed = 1f;

    [SerializeField]
    private float offset;

    private Vector2 startPosition;
    private float newXposition;

    // Start is called before the first frame update
    void Start()
    {
        startPosition = transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        newXposition = Mathf.Repeat(Time.time * -moveSpeed, offset);
        transform.position = startPosition + Vector2.right * newXposition;
    }
}
