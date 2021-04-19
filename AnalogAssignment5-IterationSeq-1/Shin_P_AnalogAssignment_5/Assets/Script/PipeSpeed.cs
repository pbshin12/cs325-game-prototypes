using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PipeSpeed : MonoBehaviour
{
    public static Vector2 pipeSpeed = new Vector2(-5, 0);

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        GetComponent<Rigidbody2D>().velocity = pipeSpeed;
    }

    /* Pipes instantly kills the player */
    private void OnTriggerEnter2D(Collider2D collision)
    {

        if (collision.gameObject.tag == "Player")
        {
            GameManager.playerAlive = false;
        }
    }
}
